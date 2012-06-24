<?php

class RouteController extends DrupalDefaultEntityController {
    
    public function save($route) {
        drupal_write_record('routes', $route);
        field_attach_insert('route', $route);
        module_invoke_all('entity_insert', 'route', $route);
    
	 return $route;
    }

	public function buildContent($entity, $view_mode = 'full', $langcode = NULL, $content = array()) {
	    $content = parent::buildContent($entity, $view_mode, $langcode, $content);
	    $content['route_sample_data'] =  array(
	      '#markup' => theme('route_sample_data', array('route_sample_data' => check_plain($entity->longitude['longitude']), 'route' => $entity)),
	    );

    return $content;
  }
  
}

