<?php

class AreaController extends DrupalDefaultEntityController {
    
    public function save($area) {
        drupal_write_record('areas', $area);
        field_attach_insert('area', $area);
        module_invoke_all('entity_insert', 'area', $area);
    
	 return $area;
    }

	public function buildContent($entity, $view_mode = 'full', $langcode = NULL, $content = array()) {
	    $content = parent::buildContent($entity, $view_mode, $langcode, $content);
	    $content['area_sample_data'] =  array(
	      '#markup' => theme('area_sample_data', array('area_sample_data' => check_plain($entity->longitude['longitude']), 'area' => $entity)),
	    );

    return $content;
  }
  
}

