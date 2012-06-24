<?php

/**
 * @file
 * Contains a Views field handler to take care of displaying deletes links
 * as fields
 */


class area_handler_delete_link_field extends area_handler_link_field {
  function construct() {
    parent::construct();
    $this->additional_fields['aid'] = 'aid';
  }


  function render($values) {
       
    $text = !empty($this->options['text']) ? $this->options['text'] : t('delete');
    $aid = $values->{$this->aliases['aid']};
    
    return l($text, 'area/' . $aid . '/delete');
  }
}
